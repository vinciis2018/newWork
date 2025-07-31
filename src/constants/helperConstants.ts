// Helper function to clean and format URLs
const cleanUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_SERVER?.replace(
    /[\\"\\']/g,
    ""
  ).replace(/\/$/, "");
  console.log(`${baseUrl}${path}`)
  return `${baseUrl}${path}`;
};

export const aws = cleanUrl("/api/v1/aws");

