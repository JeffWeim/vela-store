import { Field } from 'formik'
import FieldError from 'components/form/FieldError'
import PropTypes from 'prop-types'

const CheckboxField = ({ label, name, ...props }) =>
  <fieldset>
    <Field id='checkbox' type='checkbox' name={name} {...props} />
    <label htmlFor='checkbox'>
      {label}
    </label>
    <FieldError name={name} />
    <style jsx>{`
      fieldset {
        position: relative;
      }

      :global(input[type="checkbox"]) {
        -webkit-appearance: none;
        padding-right: 1.5em;
        background-color: white;
        border: none;
      }

      label {
        font-weight: 400 !important;
        font-size: 16px;
        top: 0;
        position: absolute;
        padding-top: 4px;
      }

      @supports(-webkit-appearance: none) {
        :global(input[type="checkbox"]) {
          -webkit-appearance: none;
          width: 1.2rem;
          height: 1.2rem;
          box-sizing: border-box;
          margin-right: 6px;
          background: #fafafa;
          box-shadow: 0 2px 3px rgba(0,0,0,0.05), 0 2px 3px rgba(0,0,0,0.05);
        }

        :global(input[type="checkbox"]):checked {
          position: relative;
        }

        :global(input[type="checkbox"]):checked::after {
          position: absolute;
          top: 0.3em;
          left: 0.2em;
          content: "";
          width: 1.0em;
          height: 0.3em;
          border: 4px solid #3e5052;
          border-right: none;
          border-top: none;
          transform: rotate(-45deg);
        }
      }
    `}</style>
  </fieldset>

CheckboxField.propTypes = {
  label: PropTypes.string
}

export default CheckboxField