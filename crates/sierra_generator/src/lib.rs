//! Lowering from the semantic model down to Sierra. See [semantic] and  [sierra]

mod ap_change;
mod block_generator;
pub mod db;
mod diagnostic;
mod dup_and_drop;
mod expr_generator_context;
mod function_generator;
mod id_allocator;
mod local_variables;
mod next_statement_index_fetch;
pub mod pre_sierra;
mod program_generator;
mod resolve_labels;
mod specialization_context;
mod store_variables;
pub mod test_utils;
mod types;
mod utils;

pub use ap_change::ApChange;
pub use diagnostic::SierraGeneratorDiagnostic;
