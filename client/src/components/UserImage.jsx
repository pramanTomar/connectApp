// A component to render user profile image (in a circled layout)
import { Box } from "@mui/material";
import BASE_URL from "baseUrl";

const UserImage = ({image, size="60px"}) => {
    return (
        <Box width={size} height={size}>
            <img
                src={`${BASE_URL}/assets/${image}`} 
                style={{objectFit: 'cover', borderRadius: '50%'}}
                width={size}
                height={size}
                alt='user' 
            />
        </Box>
    )
};

export default UserImage;