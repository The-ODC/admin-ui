import React from "react";
import {
  Card,
  Grid,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";

import { RenderIf } from "TheOdcMfUI/helpers";
import { Button, FormInput } from "TheOdcMfUI/sharedComp";

import { PageHeader } from "../../../sharedComponents";
import { AddEditProductSkeleton } from "../components";

import { dropDownOptions } from "../../../constant";
import { useAddEditProduct } from "../hooks";

function AddEditProduct() {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Theme & Layout
     */
    id,
    isEditMode,
    activeStep,

    /*
      RTK Query API State Indicators
     */
    isFetchingProduct,
    isSaving,

    /*
      Computed API Data & Memos
     */
    stepsConfig,
    control,
    selectedCategory,
    subCategoryOptions,

    /*
      Event Handler Callbacks
     */
    handleSubmit,
    onNext,
    onBack,
    handleStepClick,
  } = useAddEditProduct();

  return (
    <>
      <PageHeader
        pageTitle={
          isEditMode ? (
            <>
              Edit Dish -
              <Typography variant="span" color="text.disabled" ml={2}>
                {`#${id}`}
              </Typography>
            </>
          ) : (
            "Add New Dish"
          )
        }
        hideExportBtn
        showBackBtn
      />
      {isEditMode && isFetchingProduct ? (
        <AddEditProductSkeleton />
      ) : (
        <Stack spacing={3}>
          <Card>
            <Stepper activeStep={activeStep}>
              {stepsConfig.map(({ label }, index) => (
                <Step key={label}>
                  <StepButton onClick={() => handleStepClick(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Card>

          <Card component="form" onSubmit={handleSubmit}>
            <RenderIf render={activeStep === 0}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormInput name="name" label="Dish Name" control={control} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormInput
                    name="status"
                    label="Status"
                    inputType="select"
                    control={control}
                    options={dropDownOptions.productMgmt.formStatus}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormInput
                    name="description"
                    label="Dish Description"
                    inputType="textarea"
                    control={control}
                  />
                </Grid>
              </Grid>
            </RenderIf>

            <RenderIf render={activeStep === 1}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormInput name="price" label="Price (₹)" control={control} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormInput
                    name="discountPrice"
                    label="Discount Price (₹)"
                    control={control}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormInput name="stock" label="Stock" control={control} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormInput
                    name="sku"
                    label="SKU / Dish Code"
                    control={control}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormInput
                    name="category"
                    label="Category"
                    control={control}
                    inputType="select"
                    options={dropDownOptions.productMgmt.category.filter(
                      (opt) => opt.value !== ""
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormInput
                    name="subCategory"
                    label="Cuisine Type"
                    control={control}
                    inputType="select"
                    options={subCategoryOptions}
                    disabled={!selectedCategory}
                  />
                </Grid>
              </Grid>
            </RenderIf>

            <RenderIf render={activeStep === 2}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <FormInput
                    name="images"
                    control={control}
                    label="Upload Dish Images"
                    inputType="file"
                    multiple={true}
                    accept="image/*"
                    rowHeight={4}
                  />
                </Grid>
              </Grid>
            </RenderIf>

            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={2}
              mt={4}
            >
              <Button
                disabled={activeStep === 0 || isSaving}
                type="button"
                variant="outlined"
                onClick={onBack}
              >
                Back
              </Button>
              {activeStep === stepsConfig.length - 1 ? (
                <Button
                  key="submit-btn"
                  variant="contained"
                  type="submit"
                  loading={isSaving}
                  disabled={isSaving}
                >
                  {isEditMode ? "Update Dish" : "Create Dish"}
                </Button>
              ) : (
                <Button
                  key="next-btn"
                  variant="contained"
                  type="button"
                  onClick={onNext}
                  disabled={isSaving}
                >
                  Next
                </Button>
              )}
            </Stack>
          </Card>
        </Stack>
      )}
    </>
  );
}

export default AddEditProduct;
