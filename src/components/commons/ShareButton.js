import React from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { FaShareAlt } from "react-icons/fa";

const ShareButton = ({ title }) => {
  const currentPageUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Check this out!",
          text: "Take a look at this product!",
          url: currentPageUrl,
        });
      } catch (error) {
        console.error("Error sharing content: ", error);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(currentPageUrl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy: ", error);
      }
    } else {
      alert("Your browser doesn't support sharing or copying!");
    }
  };

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Share this product</Tooltip>}
    >
      <button
        type="button"
        style={{
          background: "none",
          border: "none",
          float: "right",
          marginRight: "30px",
        }}
        onClick={handleShare}
      >
        <FaShareAlt />
      </button>
    </OverlayTrigger>
  );
};

export default ShareButton;
