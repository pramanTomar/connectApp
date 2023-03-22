// A helper component that can be used in page styling
import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({theme, isfirstpost}) => ({
  padding: '1.5rem 1.5rem 0.75rem 1.5rem',
  backgroundColor: theme.palette.background.alt,
  borderRadius: `${isfirstpost === "true" ? '0 0.75rem 0.75rem 0.75rem' : '0.75rem'}`
}))

export default WidgetWrapper;
