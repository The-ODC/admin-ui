import React, { useState } from "react";
import Slider from "react-slick";
import Zoom from "react-medium-image-zoom";
import {
  Box,
  useTheme,
  IconButton,
  Typography,
  GlobalStyles,
  alpha,
} from "@mui/material";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Restaurant,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const ProductImageGallery = ({ images = [], dirPath = "" }) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState({});

  const getImageSrc = (img) => {
    if (!img) return "";
    if (
      /^https?:\/\//i.test(img) ||
      img.startsWith("data:") ||
      img.startsWith("blob:")
    ) {
      return img;
    }
    const base = String(dirPath || "").replace(/\/+$/, "");
    const file = String(img).replace(/^\/+/, "");
    return base ? `${base}/${file}` : file;
  };

  if (!images.length) {
    return (
      <Box
        sx={{
          height: 280,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === "dark" ? 0.08 : 0.04
          ),
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          gap: 1.5,
        }}
      >
        <Restaurant
          sx={{ fontSize: 52, color: "primary.main", opacity: 0.8 }}
        />
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          No Images Available
        </Typography>
      </Box>
    );
  }

  const Arrow = ({ onClick, direction }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        [direction === "left" ? "left" : "right"]: -10,
        zIndex: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        transform: "translateY(-50%)",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      {direction === "left" ? (
        <ArrowBackIosNew fontSize="small" />
      ) : (
        <ArrowForwardIos fontSize="small" />
      )}
    </IconButton>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: Math.min(images.length, 4),
    slidesToScroll: 1,
    arrows: true,
    focusOnSelect: true,
    afterChange: (index) => setActiveIndex(index),
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(images.length, 3) },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: Math.min(images.length, 2) },
      },
    ],
  };

  return (
    <>
      {/* Theme-based global background override for zoom modal */}
      <GlobalStyles
        styles={{
          "[data-rmiz-modal-content]": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : theme.palette.grey[100],
            transition: "background-color 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "[data-rmiz-modal-img]": {
            borderRadius: "8px",
            boxShadow: theme.shadows[4],
          },
          "[data-rmiz-btn-unzoom]": {
            top: 16,
            right: 16,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: "50%",
            padding: 4,
            border: `1px solid ${theme.palette.divider}`,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          },
        }}
      />

      <Box>
        {/* Zoomed Image */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            minHeight: 220,
            maxHeight: 300,
            mx: "auto",
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {brokenImages[activeIndex] ? (
            <Box
              sx={{
                width: "100%",
                height: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "dark" ? 0.08 : 0.04
                ),
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                gap: 1.5,
              }}
            >
              <Restaurant
                sx={{ fontSize: 52, color: "primary.main", opacity: 0.8 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                Image unavailable
              </Typography>
            </Box>
          ) : (
            <Zoom>
              <img
                src={getImageSrc(images[activeIndex])}
                alt={`Product ${activeIndex + 1}`}
                onError={() =>
                  setBrokenImages((prev) => ({ ...prev, [activeIndex]: true }))
                }
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 8,
                  objectFit: "contain",
                }}
              />
            </Zoom>
          )}
        </Box>

        {/* Carousel or Skip if One Image */}
        {images.length > 1 && (
          <Box sx={{ px: 2, position: "relative" }}>
            <Slider {...settings}>
              {images?.map((img, idx) => (
                <Box
                  key={idx + 1}
                  sx={{ px: 1, cursor: "pointer" }}
                  onClick={() => setActiveIndex(idx)}
                >
                  {brokenImages[idx] ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: 70,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "action.hover",
                        borderRadius: 2,
                        border: "1px dashed",
                        borderColor: "divider",
                      }}
                    >
                      <Restaurant
                        sx={{
                          fontSize: 24,
                          color: "text.disabled",
                          opacity: 0.7,
                        }}
                      />
                    </Box>
                  ) : (
                    <img
                      src={getImageSrc(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [idx]: true }))
                      }
                      style={{
                        width: "100%",
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 8,
                        border:
                          activeIndex === idx
                            ? `2px solid ${theme.palette.primary.main}`
                            : `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Slider>
          </Box>
        )}
      </Box>
    </>
  );
};

// props validation
ProductImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  dirPath: PropTypes.string.isRequired,
};

export default ProductImageGallery;
