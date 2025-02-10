let rangeDate = {start: new Date(), end: new Date(), endIncluded: new Date(), min: new Date(), max: new Date()};

const initCalendar = (isClips) => {
  const picker = new easepick.create({
    element: document.getElementById('datepicker'),
    css: [
      'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
      'css/stylesheetOptions.css'
    ],
    autoApply: false,
    inline: true,
    plugins: ['AmpPlugin', 'RangePlugin', 'LockPlugin', 'PresetPlugin'],
    AmpPlugin: {
      darkMode: true,
      dropdown: { minYear: 1950, maxYear: null, months: true, years: true }
    },
    RangePlugin: {
      startDate: rangeDate.start,
      endDate: rangeDate.end
    },
    LockPlugin: {
      minDate: rangeDate.min,
      maxDate: rangeDate.max
    },
    PresetPlugin: {
      position: 'bottom',
      customPreset: {
        "2016 - Today": [rangeDate.min, rangeDate.max],
      }
    },
    setup(picker) {
      picker.on('select', (e) => {
        clipId = null;
        rangeDate.start = e.detail.start;
        rangeDate.end = e.detail.end;
        rangeDate.endIncluded = rangeDate.end;
        rangeDate.endIncluded.setHours(24, 0, 0);
        if(isClips)
          showClips(true);
        else
          showTranscripts(true);
      });
    }
  });
};