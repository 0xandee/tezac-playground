use dep::aztec::{
    macros::notes::partial_note,
    prelude::{NoteHeader, NullifiableNote, PrivateContext},
    protocol_types::{address::AztecAddress, traits::Packable},
    note::utils::compute_note_hash_for_nullify,
    protocol_types::{
        constants::GENERATOR_INDEX__NOTE_NULLIFIER,
        hash::poseidon2_hash_with_separator,
    },
    oracle::random::random,
    keys::getters::{get_nsk_app, get_public_keys},
};


#[derive(Serialize)]
#[event]
pub struct NFTListing {
    token_id: Field,
    price: Field,
    seller: AztecAddress,
    active: bool,
}

#[derive(Serialize)]
struct PrivateListing {
    token_id: Field,
    price: Field,
    seller: AztecAddress,
    active: bool,
    nonce: Field,
}


#[partial_note(quote {token_id, price})]
pub struct ListingNote {
    // The NFT token ID being listed
    token_id: Field,
    // Price in base currency (e.g. ETH)
    price: Field,
    // The seller's address
    seller: AztecAddress,
    // The listing expiration timestamp
    expiry: u64,
    // Randomness for privacy
    randomness: Field,
}

impl ListingNote {
    pub fn new(token_id: Field, price: Field, seller: AztecAddress, expiry: u64) -> Self {
        let randomness = unsafe { random() };
        ListingNote {
            token_id,
            price,
            seller,
            randomness,
            expiry,
            header: NoteHeader::empty()
        }
    }

    pub fn is_expired(self, current_time: u64) -> bool {
    let expiry_int = self.expiry;
    current_time > expiry_int
    }
}

impl NullifiableNote for ListingNote {
    fn compute_nullifier(
        self,
        context: &mut PrivateContext,
        note_hash_for_nullify: Field,
    ) -> Field {
        let seller_npk_m_hash: Field = get_public_keys(self.seller).npk_m.hash();
        let secret = context.request_nsk_app(seller_npk_m_hash);
        poseidon2_hash_with_separator(
            [note_hash_for_nullify, secret],
            GENERATOR_INDEX__NOTE_NULLIFIER as Field,
        )
    }

        unconstrained fn compute_nullifier_without_context(self) -> Field {
        let note_hash_for_nullify = compute_note_hash_for_nullify(self);
        let seller_npk_m_hash: Field = get_public_keys(self.seller).npk_m.hash();
        let secret = get_nsk_app(seller_npk_m_hash);
        poseidon2_hash_with_separator(
            [note_hash_for_nullify, secret],
            GENERATOR_INDEX__NOTE_NULLIFIER as Field,
        )
    }
}
