import { Variants } from "motion";

export const fadeIn = (duration: number = 0.5, delay: number = 0): Variants => ({
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration,
      delay
    }
  }
});

export const fadeInUp = (duration: number = 0.5, delay: number = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  }
});

export const fadeInDown = (duration: number = 0.5, delay: number = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: -20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  }
});

export const fadeInLeft = (duration: number = 0.5, delay: number = 0): Variants => ({
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  }
});

export const fadeInRight = (duration: number = 0.5, delay: number = 0): Variants => ({
  hidden: {
    opacity: 0,
    x: 20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  }
});

export const scaleIn = (duration: number = 0.5, delay: number = 0): Variants => ({
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  }
});

export const staggerContainer = (staggerChildren: number = 0.1, delayChildren: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren,
      staggerChildren
    }
  }
});
