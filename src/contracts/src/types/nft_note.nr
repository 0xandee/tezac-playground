use dep::aztec::{
    keys::getters::{get_nsk_app, get_public_keys},
    macros::notes::partial_note,
    note::utils::compute_note_hash_for_nullify,
    oracle::random::random,
    prelude::{NoteHeader, NullifiableNote, PrivateContext},
    protocol_types::{
        address::AztecAddress, constants::GENERATOR_INDEX__NOTE_NULLIFIER,
        hash::poseidon2_hash_with_separator,
    },
};

#[partial_note(quote { token_id  })]
pub struct NFTNote {
    token_id: Field,
    owner: AztecAddress,
    randomness: Field,
}

impl NullifiableNote for NFTNote {
    fn compute_nullifier(
        self,
        context: &mut PrivateContext,
        note_hash_for_nullify: Field,
    ) -> Field {
        let owner_npk_m_hash: Field = get_public_keys(self.owner).npk_m.hash();
        let secret = context.request_nsk_app(owner_npk_m_hash);
        poseidon2_hash_with_separator(
            [note_hash_for_nullify, secret],
            GENERATOR_INDEX__NOTE_NULLIFIER as Field,
        )
    }

    unconstrained fn compute_nullifier_without_context(self) -> Field {
        let note_hash_for_nullify = compute_note_hash_for_nullify(self);
        let owner_npk_m_hash: Field = get_public_keys(self.owner).npk_m.hash();
        let secret = get_nsk_app(owner_npk_m_hash);
        poseidon2_hash_with_separator(
            [note_hash_for_nullify, secret],
            GENERATOR_INDEX__NOTE_NULLIFIER as Field,
        )
    }
}

impl NFTNote {
    pub fn new(token_id: Field, owner: AztecAddress) -> Self {
        let randomness = unsafe { random() };
        NFTNote { token_id, owner, randomness, header: NoteHeader::empty() }
    }
}

impl Eq for NFTNote {
    fn eq(self, other: Self) -> bool {
        (self.token_id == other.token_id)
            & (self.owner == other.owner)
            & (self.randomness == other.randomness)
    }
}
