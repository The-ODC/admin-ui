import React from "react";
import { useParams } from "react-router-dom";

import { StatusChip } from "TheOdcMfUI/sharedComp";
import { formatCurrency } from "TheOdcMfUI/utility";

import { useGetProductByIdQuery } from "../../../store/rtkServices/productsMgmt";
import { dropDownOptions } from "../../../constant";

export function useProductDetails() {
  /*
    Hooks & Theme Configuration
   */
  const { id } = useParams();

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const { data, isLoading, isFetching } = useGetProductByIdQuery(id);

  /*
    Computed Values & Memos (State Aggregates)
   */
  const { product: productDetailsData = null, folderLocation = "" } =
    data || {};

  const visualizeFormatDishDetails = {
    "Dish Code": productDetailsData?.sku,
    Category: getCategoryLabel(productDetailsData?.category),
    "Cuisine Type": getSubCategoryLabel(
      productDetailsData?.category,
      productDetailsData?.subCategory
    ),
    Price: formatCurrency(productDetailsData?.price),
    Discount: formatCurrency(productDetailsData?.discountPrice),
    Stock: productDetailsData?.stock,
    Status: (
      <StatusChip
        status={
          productDetailsData?.status === "inActive" ||
          productDetailsData?.status === "blocked"
            ? "inActive"
            : Number(productDetailsData?.stock || 0) <= 0
              ? "outOfStock"
              : "active"
        }
      />
    ),
    Rating: productDetailsData?.rating,
    Created: productDetailsData?.createdAt,
    Updated: productDetailsData?.updatedAt,
  };

  /*
    Formatting & Utility Helpers
   */
  function getCategoryLabel(catValue) {
    const found = dropDownOptions.productMgmt.category.find(
      (opt) => opt.value === catValue
    );
    return found ? found.label : catValue;
  }

  function getSubCategoryLabel(catValue, subCatValue) {
    if (catValue && dropDownOptions.productMgmt.subCategory[catValue]) {
      const found = dropDownOptions.productMgmt.subCategory[catValue].find(
        (opt) => opt.value === subCatValue
      );
      if (found) return found.label;
    }
    for (const cat of Object.keys(dropDownOptions.productMgmt.subCategory)) {
      const found = dropDownOptions.productMgmt.subCategory[cat].find(
        (opt) => opt.value === subCatValue
      );
      if (found) return found.label;
    }
    return subCatValue;
  }

  return {
    id,
    isLoading: isLoading || isFetching,
    isFetching,
    productDetailsData,
    folderLocation,
    visualizeFormatDishDetails,
  };
}
