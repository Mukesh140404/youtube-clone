import React from 'react';

// क्लास के नामों को मर्ज करने के लिए एक हेल्पर
function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

function RawSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)} {...props} />
  );
}

export { RawSkeleton };