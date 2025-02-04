mod types;
mod test;

use dep::aztec::macros::aztec;

#[aztec]
contract BoxReact {
    use crate::types::nft_note::NFTNote;
    use dep::authwit::auth::{
        assert_current_call_valid_authwit, assert_current_call_valid_authwit_public,
        compute_authwit_nullifier,
    };
    use dep::aztec::{
        encrypted_logs::encrypted_note_emission::encode_and_encrypt_note,
        macros::{
            events::event,
            functions::{initializer, internal, private, public, view},
            storage::storage,
        },
        note::constants::MAX_NOTES_PER_PAGE,
        oracle::random::random,
        prelude::{
            AztecAddress, Map, NoteGetterOptions, NoteHeader, NoteInterface, NoteViewerOptions,
            PrivateContext, PrivateMutable, PrivateSet, PublicContext, PublicImmutable,
            PublicMutable,
        },
        protocol_types::{point::Point, public_keys::OvpkM, traits::Serialize},
        keys::getters::get_public_keys,
        utils::comparison::Comparator,
    };
    use dep::compressed_string::FieldCompressedString;
    use dep::value_note::value_note::ValueNote;
    use std::meta::derive;

    #[storage]
    struct Storage<Context> {
        admin: PublicMutable<AztecAddress, Context>,
        name: PublicImmutable<FieldCompressedString, Context>,
        symbol: PublicImmutable<FieldCompressedString, Context>,
        minters: Map<AztecAddress, PublicMutable<bool, Context>, Context>,
        public_owners: Map<Field, PublicMutable<AztecAddress, Context>, Context>,
        private_nfts: Map<AztecAddress, PrivateSet<NFTNote, Context>, Context>,
        nft_exists: Map<Field, PublicMutable<bool, Context>, Context>,
        numbers: Map<AztecAddress, PrivateMutable<ValueNote, Context>, Context>,
    }

    #[public]
    #[initializer]
    fn constructor(
        owner: AztecAddress,
        admin: AztecAddress,
        name: str<31>,
        symbol: str<31>,
        number: Field,
    ) {
        assert(!admin.is_zero(), "Zero Address Detected");

        storage.admin.write(admin);
        storage.minters.at(admin).write(true);
        storage.name.initialize(FieldCompressedString::from_string(name));
        storage.symbol.initialize(FieldCompressedString::from_string(symbol));

        let mut new_number = ValueNote::new(number, owner);

        storage.numbers.at(owner).initialize(&mut new_number).emit(encode_and_encrypt_note(
        // numbers.at(owner).initialize(&mut new_number).emit(encode_and_encrypt_note(
            &mut context,
            owner,
            context.msg_sender(),
        ));
    }

    // ========================= PUBLIC STATEFUL FUNCTIONS ============================

    #[public]
    fn set_admin(new_admin: AztecAddress) {
        assert(storage.admin.read().eq(context.msg_sender()), "Caller NOT Admin");
        storage.admin.write(new_admin);
    }

    #[public]
    fn set_minter(minter: AztecAddress, approve: bool) {
        assert(storage.admin.read().eq(context.msg_sender()), "Caller NOT Admin");
        storage.minters.at(minter).write(approve);
    }

    #[public]
    fn mint(to: AztecAddress, token_id: Field) {
        assert(token_id != 0, "Zero Token ID Unsupported");
        assert(storage.minters.at(context.msg_sender()).read(), "Caller NOT Minter");
        assert(storage.nft_exists.at(token_id).read() == false, "Token Exists");

        storage.nft_exists.at(token_id).write(true);
        storage.public_owners.at(token_id).write(to);
    }

    #[public]
    fn transfer_in_public(from: AztecAddress, to: AztecAddress, token_id: Field, nonce: Field) {
        if (!from.eq(context.msg_sender())) {
            assert_current_call_valid_authwit_public(&mut context, from);
        } else {
            assert(nonce == 0, "Invalid Nonce");
        }

        let public_owners_storage = storage.public_owners.at(token_id);
        assert(public_owners_storage.read().eq(from), "Invalid Owner");

        public_owners_storage.write(to);
    }

    #[public]
    fn finalize_transfer_to_private(token_id: Field, hiding_point_slot: Field) {
        let from = context.msg_sender();
        _finalize_transfer_to_private(from, token_id, hiding_point_slot, &mut context, storage);
    }

    // ========================= PRIVATE STATEFUL FUNCTIONS ============================

    #[private]
    fn transfer_to_private(to: AztecAddress, token_id: Field) {
        let from = context.msg_sender();
        let nft = BoxReact::at(context.this_address());
        let hiding_point_slot = _prepare_private_balance_increase(to, &mut context, storage);

        nft._finalize_transfer_to_private_unsafe(from, token_id, hiding_point_slot).enqueue(
            &mut context,
        );
    }

    #[private]
    fn transfer_in_private(from: AztecAddress, to: AztecAddress, token_id: Field, nonce: Field) {
        if (!from.eq(context.msg_sender())) {
            assert_current_call_valid_authwit(&mut context, from);
        } else {
            assert(nonce == 0, "Invalid Nonce");
        }

        let nfts = storage.private_nfts;

        let notes = nfts.at(from).pop_notes(NoteGetterOptions::new()
            .select(NFTNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(notes.len() == 1, "NFT not found before Transfer");

        let mut new_note = NFTNote::new(token_id, to);
        nfts.at(to).insert(&mut new_note).emit(encode_and_encrypt_note(&mut context, to, from));
    }

    #[private]
    fn transfer_to_public(from: AztecAddress, to: AztecAddress, token_id: Field, nonce: Field) {
        if (!from.eq(context.msg_sender())) {
            assert_current_call_valid_authwit(&mut context, from);
        } else {
            assert(nonce == 0, "Invalid Nonce");
        }

        let notes = storage.private_nfts.at(from).pop_notes(NoteGetterOptions::new()
            .select(NFTNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(notes.len() == 1, "NFT not found before Public Transfer");

        BoxReact::at(context.this_address())._finish_transfer_to_public(to, token_id).enqueue(
            &mut context,
        );
    }

    #[private]
    fn cancel_authwit(inner_hash: Field) {
        let on_behalf_of = context.msg_sender();
        let nullifier = compute_authwit_nullifier(on_behalf_of, inner_hash);
        context.push_nullifier(nullifier);
    }

    #[private]
    fn prepare_private_balance_increase(to: AztecAddress) -> Field {
        _prepare_private_balance_increase(to, &mut context, storage)
    }

    #[private]
    fn setNumber(number: Field, owner: AztecAddress) {
        let numbers = storage.numbers;
        let mut new_number = ValueNote::new(number, owner);

        numbers.at(owner).replace(&mut new_number).emit(encode_and_encrypt_note(
            &mut context,
            owner,
            context.msg_sender(),
        ));
    }

    // ========================= PUBLIC VIEW FUNCTIONS ============================

    #[public]
    #[view]
    fn get_admin() -> Field {
        storage.admin.read().to_field()
    }

    #[public]
    #[view]
    fn is_minter(minter: AztecAddress) -> bool {
        storage.minters.at(minter).read()
    }

    #[public]
    #[view]
    fn owner_of(token_id: Field) -> AztecAddress {
        assert(storage.nft_exists.at(token_id).read(), "Token Non-Existent");
        storage.public_owners.at(token_id).read()
    }

    #[public]
    #[view]
    fn public_get_name() -> pub FieldCompressedString {
        storage.name.read()
    }

    #[public]
    #[view]
    fn public_get_symbol() -> pub FieldCompressedString {
        storage.symbol.read()
    }

    // ========================= PRIVATE VIEW FUNCTIONS ============================

    #[private]
    #[view]
    fn private_get_name() -> pub FieldCompressedString {
        storage.name.read()
    }

    #[private]
    #[view]
    fn private_get_symbol() -> pub FieldCompressedString {
        storage.symbol.read()
    }

    // =========================== INTERNAL FUNCTIONS ==============================

    #[public]
    #[internal]
    fn _finish_transfer_to_public(to: AztecAddress, token_id: Field) {
        storage.public_owners.at(token_id).write(to);
    }

    #[public]
    #[internal]
    fn _finalize_transfer_to_private_unsafe(
        from: AztecAddress,
        token_id: Field,
        hiding_point_slot: Field,
    ) {
        _finalize_transfer_to_private(from, token_id, hiding_point_slot, &mut context, storage);
    }

    #[public]
    #[internal]
    fn _store_payload_in_transient_storage_unsafe(
        slot: Field,
        point: Point,
        setup_log: [Field; 9],
    ) {
        context.storage_write(slot, point);
        context.storage_write(slot + aztec::protocol_types::point::POINT_LENGTH as Field, setup_log);
    }

    // ========================== LIBRARY METHODS =============================

    #[contract_library_method]
    fn _finalize_transfer_to_private(
        from: AztecAddress,
        token_id: Field,
        hiding_point_slot: Field,
        context: &mut PublicContext,
        storage: Storage<&mut PublicContext>,
    ) {
        let public_owners_storage = storage.public_owners.at(token_id);
        assert(public_owners_storage.read().eq(from), "Invalid NFT Owner");

        public_owners_storage.write(AztecAddress::zero());

        let finalization_payload =
            NFTNote::finalization_payload().new(context, hiding_point_slot, token_id);
    }

    #[contract_library_method]
    fn _prepare_private_balance_increase(
        to: AztecAddress,
        context: &mut PrivateContext,
        storage: Storage<&mut PrivateContext>,
    ) -> Field {
        let to_note_slot = storage.private_nfts.at(to).storage_slot;
        let note_randomness = unsafe { random() };
        let note_setup_payload = NFTNote::setup_payload().new(to, note_randomness, to_note_slot);

        let setup_log = note_setup_payload.encrypt_log(context, to, context.msg_sender());

        let hiding_point_slot = note_setup_payload.hiding_point.x;

        BoxReact::at(context.this_address())
            ._store_payload_in_transient_storage_unsafe(
                hiding_point_slot,
                note_setup_payload.hiding_point,
                setup_log,
            )
            .enqueue(context);

        hiding_point_slot
    }

    // ========================= UNCONSTRAINED FUNCTIONS ============================

    unconstrained fn get_private_nfts(
        owner: AztecAddress,
        page_index: u32,
    ) -> pub ([Field; MAX_NOTES_PER_PAGE], bool) {
        let offset = page_index * MAX_NOTES_PER_PAGE;
        let mut options = NoteViewerOptions::new();
        let notes = storage.private_nfts.at(owner).view_notes(options.set_offset(offset));

        let mut owned_nft_ids = [0; MAX_NOTES_PER_PAGE];
        for i in 0..options.limit {
            if i < notes.len() {
                owned_nft_ids[i] = notes.get_unchecked(i).token_id;
            }
        }

        let page_limit_reached = notes.len() == options.limit;
        (owned_nft_ids, page_limit_reached)
    }

    unconstrained fn getNumber(owner: AztecAddress) -> pub ValueNote {
        let numbers = storage.numbers;
        numbers.at(owner).view_note()
    }
}
