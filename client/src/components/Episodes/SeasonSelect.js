import React, { useEffect, useState } from 'react';

function SeasonSelect({
  items,
  onChange,
  isOpen = false,
  multiSelect = false,
}) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setOpen(!open);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  function handleOnClick(item) {
    if (
      !selection.some((current) => current.season_number === item.season_number)
    ) {
      if (!multiSelect) {
        setSelection([item]);
      } else if (multiSelect) {
        setSelection([...selection, item]);
      }
    } else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        (current) => current.season_number !== item.season_number
      );
      setSelection([...selectionAfterRemoval]);
    }
    setOpen(false);
    onChange(item.season_number);
  }

  return (
    <div className="custom-select" style={{ width: '220px' }}>
      <div
        tabIndex={0}
        className={'select-selected' + (open ? ' select-arrow-active' : '')}
        role="button"
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
      >
        {selection[0] ? selection[0].name : items[0].name}
      </div>
      {open && (
        <div className="select-items">
          {items.map((item) => (
            <div
              key={item.season_number}
              onClick={() => handleOnClick(item)}
              className={'select-item'}
            >
              {item.name}
              &nbsp;&nbsp;
              <span className={'subitem-right'}>{`(${
                item.episodes.length
              } Episode${item.episodes.length > 1 ? `s` : ``})`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SeasonSelect;
