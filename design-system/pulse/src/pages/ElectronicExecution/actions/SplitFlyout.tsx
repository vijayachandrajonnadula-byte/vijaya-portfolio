import AssignDrawer from './AssignDrawer';

/** Split execution: give tables (entire, or chosen rows) to executors. The store enforces the rules. */
export default function SplitFlyout() {
  return <AssignDrawer mode="split" />;
}
