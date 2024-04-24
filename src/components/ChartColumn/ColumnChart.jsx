/* eslint-disable react/prop-types */
import './ColumnChart.css';

export default function ColumnChart({amount, day, short, showAmount, hideAmount, toggleAmount, show}) {
  return (
    <div className="col-wrapper" >
      <div className='amount'>₴{amount}</div>
      <div className={`dashboard-column ${day === short ? 'today' : ''}`} style={{height: `${amount/20}%`}}
        onMouseOver={(e) => showAmount(e)}
        onMouseOut={(e) => hideAmount(e)}
        onClick={(e) => toggleAmount(e)}
      >
        <span>{`${show}`}</span>
      </div>
      <p className="chart-col-day">{day}</p>
    </div> 
  )
}
