import { PHONE_COUNTRY_CODES } from '@/utils/phoneCountryCodes';

interface PhoneWithCountryFieldsProps {
  countrySelectName: string;
  nationalInputName: string;
  countrySelectId: string;
  nationalInputId: string;
  defaultDialCode?: string;
  nationalPlaceholder?: string;
  nationalRequired?: boolean;
  /** Applied to both &lt;select&gt; and national &lt;input&gt; */
  fieldClassName: string;
  /** e.g. text-sm py-2 for compact rows */
  selectClassName?: string;
}

export function PhoneWithCountryFields({
  countrySelectName,
  nationalInputName,
  countrySelectId,
  nationalInputId,
  defaultDialCode = '44',
  nationalPlaceholder = '7xxx xxxxxx',
  nationalRequired = false,
  fieldClassName,
  selectClassName,
}: PhoneWithCountryFieldsProps) {
  const selectCn = selectClassName || fieldClassName;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="sm:w-[min(100%,15rem)] shrink-0">
        <label htmlFor={countrySelectId} className="sr-only">
          Country calling code
        </label>
        <select
          id={countrySelectId}
          name={countrySelectName}
          className={selectCn}
          defaultValue={defaultDialCode}
        >
          {PHONE_COUNTRY_CODES.map((c) => (
            <option key={c.dial} value={c.dial}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-0">
        <label htmlFor={nationalInputId} className="sr-only">
          Mobile number without country code
        </label>
        <input
          type="tel"
          id={nationalInputId}
          name={nationalInputName}
          required={nationalRequired}
          className={fieldClassName}
          placeholder={nationalPlaceholder}
          inputMode="numeric"
          autoComplete="tel-national"
        />
      </div>
    </div>
  );
}
