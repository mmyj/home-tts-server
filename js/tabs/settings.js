function initSettings() {
  const settings = getSettings();
  const toggle   = document.getElementById('st_parallel_enabled');
  const conc     = document.getElementById('st_concurrency');
  const minLen   = document.getElementById('st_split_min_len');

  if (toggle)  toggle.checked = settings.parallelEnabled    || false;
  if (conc)    conc.value     = settings.parallelConcurrency || 3;
  if (minLen)  minLen.value   = settings.splitMinLength      || 20;

  const persist = () => saveSettings({
    parallelEnabled:     toggle?.checked           || false,
    parallelConcurrency: parseInt(conc?.value)     || 3,
    splitMinLength:      parseInt(minLen?.value)   || 20,
  });

  if (toggle)  toggle.addEventListener('change', persist);
  if (conc)    conc.addEventListener('change', persist);
  if (minLen)  minLen.addEventListener('change', persist);
}
