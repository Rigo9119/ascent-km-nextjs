import { AnyFieldApi } from "@tanstack/react-form";

export const FieldInfo = ({ field }: { field: AnyFieldApi }) => {
  return (
    <>
      {field?.state?.meta?.isTouched && !field?.state?.meta?.isValid ? (
        <em className='mt-2'>{field?.state?.meta?.errors.join(', ')}</em>
      ) : null}
      {field?.state?.meta?.isValidating ? 'Validating...' : null}
    </>
  )
}
