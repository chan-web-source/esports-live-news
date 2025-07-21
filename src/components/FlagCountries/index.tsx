import { forwardRef } from "react";
import styles from './style.module.css';

interface Props {
  countries?: Country[];
  onSelect: (country: Country | undefined) => void;
}

const FlagCountries = forwardRef<HTMLDivElement, Props>(({ countries, onSelect }, ref) => {
  return (
    <div ref={ref} className={styles.dropdownMenu}>
      {countries?.map((country: Country) => (
        <div
          key={country.id}
          className={styles.dropdownItem}
          onClick={() => onSelect(country)}
        >
          <img src={country.logo} className={styles.countryFlag} />
          {country.name}
        </div>
      ))}
    </div>
  )
});

export default FlagCountries;