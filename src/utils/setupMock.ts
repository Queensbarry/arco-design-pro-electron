export default (config: { mock?: boolean; setup: () => void }) => {
  // IMPORTANT: MUST CHANGE `mock` TO `false` IF USED FOR PRODUCTION
  const { mock = true, setup } = config;
  if (mock === false) return;
  setup();
};
