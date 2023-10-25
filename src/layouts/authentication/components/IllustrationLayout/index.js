import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

function IllustrationLayout({ color, header, title, description, button, illustration, children,subtitle }) {
  return (
    <PageLayout background="white">
      <Grid container>
        <Grid item xs={11} sm={8} md={6} lg={4} xl={3} sx={{ mx: "auto" }}>
          <ArgonBox display="flex" flexDirection="column" justifyContent="center" height="100vh">
            <ArgonBox pt={3} px={3}>
              {!header ? (
                <>
                  <ArgonBox mb={1}>
                    <ArgonTypography variant="h4" fontWeight="bold">
                      {title}
                    </ArgonTypography>
                  </ArgonBox>
                  <ArgonTypography  fontWeight="regular" color="text">
                    {description}
                  </ArgonTypography>
                  <ArgonTypography  fontWeight="regular" color="text">
                    {subtitle}
                  </ArgonTypography>
                  
                </>
              ) : (
                header
              )}
            </ArgonBox>
            <ArgonBox p={3}>{children}</ArgonBox>
          </ArgonBox>
        </Grid>
        <Grid item xs={12} lg={6}>
        <ArgonBox
            display={{ xs: "none", lg: "flex" }}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="calc(100% - 2rem)"
            height="calc(100vh - 2rem)"
            position="relative"
            borderRadius="lg"
            textAlign="center"
            m={2}
            px={13}
            sx={{ overflow: "hidden" }}
          >
            <ArgonBox
              component="img"
              src={illustration.image}
              alt="background"
              width="100%"
              height="100%"
              position="absolute"
              top={0}
              left={0}
            />
            <ArgonBox
              bgColor={"dark"}
              variant="gradient"
              width="100%"
              height="100%"
              position="absolute"
              topl={0}
              left={0}
              opacity={0.4}
            />
            <ArgonBox position="relative">
              {illustration.title && (
                <ArgonBox mt={6} mb={1}>
                  <ArgonTypography variant="h5" color="white" fontWeight="bold">
                    {illustration.title}
                  </ArgonTypography>
                </ArgonBox>
              )}
              {illustration.description && (
                <ArgonBox mb={1}>
                  <ArgonTypography variant="h6" color="white">
                    {illustration.description}
                  </ArgonTypography>
                </ArgonBox>
              )}
              {illustration.subtitle && (
                    <ArgonBox mb={1}>
                      <ArgonTypography variant="h6" color="white" >
                        {illustration.subtitle}
                      </ArgonTypography>
                    </ArgonBox>
                  )}
            </ArgonBox>
          </ArgonBox>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

// Setting default values for the props of IllustrationLayout
IllustrationLayout.defaultProps = {
  color: 'success',
  header: "",
  title: "",
  description: "",
  subtitle: "",
  button: { color: "success" },
  illustration: {},
};

// Typechecking props for the IllustrationLayout
IllustrationLayout.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "primary", "success", "warning", "error", "dark"]),
  header: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  button: PropTypes.object,
  children: PropTypes.node.isRequired,
  illustration: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    
  }),
};

export default IllustrationLayout;