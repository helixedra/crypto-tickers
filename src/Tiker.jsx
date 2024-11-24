import PropTypes from "prop-types";
import TickerIcon from "./TickerIcon";

function Tiker({ name, openPrice, currentPrice, percentageChange }) {
  return (
    <div className="ticker">
      {/* <TickerIcon symbol="bitcoin" /> */}
      {name}{" "}
      <span className={currentPrice > openPrice ? " ticker_up" : "ticker_down"}>
        {currentPrice}{" "}
        {currentPrice > openPrice ? (
          <span>&#11205;</span>
        ) : (
          <span>&#11206;</span>
        )}
        {percentageChange}%
      </span>
    </div>
  );
}

Tiker.propTypes = {
  name: PropTypes.string,
  openPrice: PropTypes.string,
  currentPrice: PropTypes.string,
  percentageChange: PropTypes.string,
};

export default Tiker;
