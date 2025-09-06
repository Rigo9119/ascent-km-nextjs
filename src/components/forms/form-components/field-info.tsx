import { AnyFieldApi } from "@tanstack/react-form";

export const FieldInfo = ({ field }: { field: AnyFieldApi }) => {
  return (
    <div className='text-rose-500 mt-2'>
      {field?.state?.meta?.isTouched && !field?.state?.meta?.isValid ? (
        <em>{field?.state?.meta?.errors.join(', ')}</em>
      ) : null}
      {field?.state?.meta?.isValidating ? 'Validating...' : null}
    </div>
  )
}
