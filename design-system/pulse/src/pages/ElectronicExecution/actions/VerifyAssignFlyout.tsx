import AssignDrawer from './AssignDrawer';

/** Assign a verifier per table (kept in the store, with an audit entry). The verifier must be a different user from the table's executors. */
export default function VerifyAssignFlyout() {
  return <AssignDrawer mode="verify" />;
}
