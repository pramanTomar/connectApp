import { useState } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { message } from 'antd';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BASE_URL from "baseUrl";

// In order to validate form using yup
const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("Invalid Email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required")
});

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("required"),
    password: yup.string().required("required")
});

const initialValueRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: ""
}

const initialValueLogin = { email: "", password: "" };

const Form = ({setLoginPage}) => {

  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {

    const formData = new FormData();

    for(let value in values){
      formData.append(value, values[value]);
    }

    formData.append('picturePath', values.picture.name);

    const savedUserResponse = await fetch(`${BASE_URL}/auth/register`,{
      method: 'POST',
      body: formData
    })

    if(savedUserResponse.status === 200){
      setPageType('login');
      message.success("User Registeration Successfully");
      setLoginPage(true);
    }else if(savedUserResponse.status === 400){
      message.error("Email Already Exists");
    }else{
      message.error("User Registeration Failed");
    }
    onSubmitProps.resetForm();
  }

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch(`${BASE_URL}/auth/login`,{
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if(loggedIn){
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token
        })
      );
      if(loggedInResponse.status === 400){
        message.error("Invalid Credentials");
      }else if(loggedInResponse.status === 500){
        message.error("Login Failed");
      }else{
        message.success("Login Successfull");
      }
      navigate('/home');
    }
  }

  const handleFormSubmit = async (values, onSubmitProps) => {
    if(isLogin) {
      await login(values, onSubmitProps);
    }
    else{
      await register(values, onSubmitProps);
    }
  }

  return (
    <>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={ isLogin ? initialValueLogin : initialValueRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {
                isRegister && (
                  <>
                    <TextField label="First Name" onBlur={handleBlur} onChange={handleChange} value={values.firstName} name="firstName"
                      error={
                        Boolean(touched.firstName) && Boolean(errors.firstName)
                      }
                      helperText={touched.firstName && errors.firstName}
                      sx={{ gridColumn: "span 2" }}
                    />
  
                    <TextField label="Last Name" onBlur={handleBlur} onChange={handleChange} value={values.lastName} name="lastName"
                      error={
                        Boolean(touched.lastName) && Boolean(errors.lastName)
                      }
                      helperText={touched.lastName && errors.lastName}
                      sx={{ gridColumn: "span 2" }}
                    />
  
                    <TextField label="Location" onBlur={handleBlur} onChange={handleChange} value={values.location} name="location"
                      error={
                        Boolean(touched.location) && Boolean(errors.location)
                      }
                      helperText={touched.location && errors.location}
                      sx={{ gridColumn: "span 4" }}
                    />
  
                    <TextField label="Occupation" onBlur={handleBlur} onChange={handleChange} value={values.occupation} name="occupation"
                      error={
                        Boolean(touched.occupation) && Boolean(errors.occupation)
                      }
                      helperText={touched.occupation && errors.occupation}
                      sx={{ gridColumn: "span 4" }}
                    />
  
                    {/* Box inputting profile image (using dropzone) */}
                    <Box gridColumn="span 4" border={`1px solid ${palette.neutral.medium}`} borderRadius="5px">
                      <Dropzone acceptFiles='.jpeg,.jpg,.png' multiple={false} onDrop={(acceptedFiles) => {setFieldValue('picture', acceptedFiles[0])}}> 
                        {({ getRootProps, getInputProps }) => (
                          <Box
                            {...getRootProps()}
                            border={`2px dashed ${palette.primary.main}`}
                            p="1rem"
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          >
                            <input {...getInputProps()} />
                            {!values.picture ? (
                              <Box>Add Profile Picture Here</Box>
                            ) : (
                              <FlexBetween>
                                <Typography>{values.picture.name}</Typography>
                                <EditOutlinedIcon />
                              </FlexBetween>
                            )}
                          </Box>
                        )}
                      </Dropzone>
                    </Box>
                  </>
                )
              }
                <TextField label="Email" onBlur={handleBlur} onChange={handleChange} value={values.email} name="email"
                  error={
                    Boolean(touched.email) && Boolean(errors.email)
                  }
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
  
                <TextField label="Password" type='password' onBlur={handleBlur} onChange={handleChange} value={values.password} name="password"
                  error={
                    Boolean(touched.password) && Boolean(errors.password)
                  }
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
            </Box>
  
            {/* Submit Button */}
            <Box>
              <Button fullWidth type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  setLoginPage(isLogin ? false : true);
                  resetForm(); // Clear form while switching in between pages
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up here"
                  : "Already have an account? Login here"}
              </Typography>
            </Box>
          </form>
        )}
      </Formik>
      </>
  )
}

export default Form;
