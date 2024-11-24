import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function TickerIcon({ symbol }) {
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    async function fetchIcon() {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}`
        );
        setIconUrl(response.data.image.thumb); // Використання мініатюри
      } catch (error) {
        console.error("Помилка завантаження іконки:", error);
      }
    }

    fetchIcon();
  }, [symbol]);

  return (
    <div>
      {iconUrl ? (
        <img src={iconUrl} alt={`${symbol} icon`} width="32" height="32" />
      ) : (
        "Завантаження..."
      )}
    </div>
  );
}
TickerIcon.propTypes = {
  symbol: PropTypes.string,
};

export default TickerIcon;
