export const ErrorBoundaryFallback = ({ error }: { error: Error | null }) => (
    <ErrorBox error={error} />
);
  
const isError = (value: any): value is Error => value?.message;

export const ErrorBox = ({ error }: { error: unknown }) => {
    if (isError(error)) {
        return <div className="h-screen flex justify-center align-middle">{error?.message}</div>;
    }

    return null;
};
