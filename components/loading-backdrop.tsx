"use client";

import { Loading, LoadingProps } from "./loading";
import { motion } from "framer-motion";
import clsx from "clsx";

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

interface LoadingBackdropProps {
  show?: boolean;
  className?: string;
  isFullScreen?: boolean;
  loadingProps?: LoadingProps;
}
export const LoadingBackdrop = ({
  show,
  className,
  isFullScreen,
  loadingProps,
}: LoadingBackdropProps) => {
  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate={show ? "visible" : "hidden"}
      className={clsx(
        "flex items-center justify-center bg-slate-950 bg-opacity-80",
        { "pointer-events-none": !show },
        {
          "fixed top-0 left-0 overflow-hidden w-full h-screen": isFullScreen,
          "absolute w-full h-full": !isFullScreen,
        },
        className
      )}
    >
      <Loading {...loadingProps} />
    </motion.div>
  );
};
