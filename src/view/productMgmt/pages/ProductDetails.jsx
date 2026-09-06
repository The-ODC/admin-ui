import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Card, Divider, Grid, Stack, Typography } from "@mui/material";
import { DriveFileRenameOutline } from "@mui/icons-material";

import { Button } from "TheOdcMfUI/sharedComp";

import { PageHeader } from "../../../sharedComponents";
import { ProductDetailsSkeleton, ProductImageGallery } from "../components";

import { VITE_APP_ASSETS_PATH } from "../../../config/env";
import { useProductDetails } from "../hooks";

function ProductDetails() {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Theme & Layout
     */
    id,

    /*
      RTK Query API State Indicators
     */
    isLoading,

    /*
      Computed API Data & Memos
     */
    productDetailsData,
    folderLocation,
    visualizeFormatDishDetails,
  } = useProductDetails();

  return (
    <>
      <PageHeader
        pageTitle={
          <>
            Dish Details -
            <Typography
              variant="span"
              color="text.disabled"
              ml={2}
            >{`#${productDetailsData?._id || id}`}</Typography>
          </>
        }
        hideExportBtn
        showBackBtn
      >
        <Button
          variant="contained"
          component={NavLink}
          to={`/dish-management/edit-dish/${id}`}
          state={{ editableProductData: productDetailsData }}
          endIcon={<DriveFileRenameOutline />}
          disabled={isLoading || !productDetailsData}
        >
          Edit Dish
        </Button>
      </PageHeader>
      {isLoading || !productDetailsData?._id ? (
        <ProductDetailsSkeleton />
      ) : (
        <Stack spacing={3}>
          {/* Dish Image & Basic Info */}
          <Card>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: 4,
              }}
            >
              <Box
                sx={{ width: { xs: "100%", lg: 400 }, order: { xs: 2, lg: 1 } }}
              >
                <ProductImageGallery
                  images={productDetailsData?.images}
                  dirPath={`${VITE_APP_ASSETS_PATH}${folderLocation}/`}
                />
              </Box>

              <Box sx={{ flex: 1, order: { xs: 1, lg: 2 } }}>
                <Typography variant="h5" fontWeight="bold">
                  {productDetailsData?.name}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {productDetailsData?.description}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1 }}
                  color="text.secondary"
                >
                  Variants:{" "}
                  {productDetailsData?.variants
                    ?.map((v) => `${v.size} (Stock: ${v.stock})`)
                    .join(", ")}
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Dish Metadata */}
          <Card>
            <Typography variant="h6" gutterBottom>
              Dish Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {Object.entries(visualizeFormatDishDetails).map(
                ([label, value]) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={label}>
                    <Typography
                      variant="body2"
                      gutterBottom={3}
                      color="text.secondary"
                    >
                      {label}
                    </Typography>
                    <Typography variant="body1">{value || "N/A"}</Typography>
                  </Grid>
                )
              )}
            </Grid>
          </Card>
        </Stack>
      )}
    </>
  );
}

export default ProductDetails;
