'use client';

import { Variants, motion } from 'framer-motion';
import Image from 'next/image';

const variants: Variants = {
  initial: {
    opacity: 1,
    y: '-70%',
    scale: 1,
  },
  hasContent: {
    opacity: 0.3,
    y: '-50%',
    scale: 0.8,
  },
};

interface RobotImageProps {
  hasContent?: boolean;
}

export const RobotImage = ({ hasContent }: RobotImageProps) => {
  return (
    <motion.div
      className="absolute mx-auto w-full max-w-none justify-center sm:max-w-lg"
      variants={variants}
      initial="initial"
      animate={hasContent ? 'hasContent' : 'initial'}
    >
      <Image src="/guessai.png" width={640} height={553} alt="guess ai robot" />
    </motion.div>
  );
};
