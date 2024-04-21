/* eslint-disable react/prop-types */
import { useRef } from 'react';
import './DashBoardColumn.css';

export default function DashBoardColumn(props) {
  const refCol = useRef(null);
  // refCol.current.style.setProperty('--x', props.amount)
  console.log(refCol.current)
  return (
    <div ref={refCol} className='dashboard-column'></div>
  )
}
