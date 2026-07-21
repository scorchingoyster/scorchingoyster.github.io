(() => {
  const tooltipTriggers = document.querySelectorAll('.tooltip-trigger[data-tooltip]');

  if (!tooltipTriggers.length) return;

  const tooltips = Array.from(tooltipTriggers, (trigger, index) => {
    const tooltip = document.createElement('span');
    tooltip.id = `tooltip-${index + 1}`;
    tooltip.className = 'tooltip';
    tooltip.role = 'tooltip';
    tooltip.textContent = trigger.dataset.tooltip;
    tooltip.hidden = true;
    document.body.appendChild(tooltip);
    trigger.setAttribute('aria-describedby', tooltip.id);

    const show = () => {
      tooltip.hidden = false;

      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const gap = 8;
      const viewportMargin = 8;
      const centeredLeft = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;

      tooltip.style.left = `${Math.min(
        window.innerWidth - tooltipRect.width - viewportMargin,
        Math.max(viewportMargin, centeredLeft)
      )}px`;

      const positionAbove = triggerRect.top - tooltipRect.height - gap;
      tooltip.style.top = `${positionAbove >= viewportMargin
        ? positionAbove
        : triggerRect.bottom + gap}px`;
    };

    const hide = () => {
      tooltip.hidden = true;
    };

    trigger.addEventListener('pointerenter', show);
    trigger.addEventListener('pointerleave', hide);
    trigger.addEventListener('focus', show);
    trigger.addEventListener('blur', hide);
    trigger.addEventListener('click', () => {
      if (tooltip.hidden) {
        show();
      } else {
        hide();
      }
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        hide();
        trigger.blur();
      }
    });

    return { tooltip, show, hide };
  });

  window.addEventListener('resize', () => {
    tooltips.forEach(({ tooltip, show }) => {
      if (!tooltip.hidden) show();
    });
  });

  window.addEventListener('scroll', () => {
    tooltips.forEach(({ hide }) => hide());
  }, { passive: true });
})();
