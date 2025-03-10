use aztec::{macros::notes::note, oracle::random::random, prelude::AztecAddress, protocol_types::traits::Serialize};

#[note]
#[derive(Eq, Serialize)]
pub struct ListingNote {
    // ID of the token
    token_id: Field,
    // The owner of the note
    owner: AztecAddress,
    // The initiating seller
    seller: AztecAddress,
    // The intended buyer
    buyer: AztecAddress,
    // The purchase price of the listing
    price: u128,
    // Randomness of the note to hide its contents
    randomness: Field,
}

impl ListingNote {
    pub fn new(token_id: Field, owner: AztecAddress, seller: AztecAddress, buyer: AztecAddress, price: u128) -> Self {
        /// Safety: We use the randomness to preserve the privacy of the note recipient by preventing brute-forcing,
        /// so a malicious sender could use non-random values to make the note less private. But they already know
        /// the full note pre-image anyway, and so the recipient already trusts them to not disclose this
        /// information. We can therefore assume that the sender will cooperate in the random value generation.
        let randomness = unsafe { random() };
        ListingNote { token_id, owner, seller, buyer, price, randomness }
    }
    pub fn default() -> Self {
        ListingNote {
            token_id: 0,
            owner: AztecAddress::zero(),
            seller: AztecAddress::zero(),
            buyer: AztecAddress::zero(),
            price: 0,
            randomness: 0,
        }
    }
}
