import { useState, useEffect } from "react";
type ScrollTo = "top" | "bottom";
interface UseScrollFunctions {
  scrollToTop: () => void;
  scrollToBottom: () => void;
  isAtTop: boolean;
  isAtBottom: boolean;
}

function useScrollFunctions(
  ref: React.RefObject<HTMLElement>,
  topThreshold = 100,
  bottomThreshold = 100
): UseScrollFunctions {
  const [scrollTo, setScrollTo] = useState<ScrollTo | null>(null);
  const [isAtTop, setIsAtTop] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      const handleScroll = () => {
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;

        // 检查是否滚动到了顶部
        if (scrollTop < topThreshold) {
          setIsAtTop(true);
        } else {
          setIsAtTop(false);
        }

        // 检查是否滚动到了底部
        if (scrollHeight - scrollTop - clientHeight < bottomThreshold) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }

        // 更新滚动方向状态
        if (scrollTo === "top" && scrollTop === 0) {
          setScrollTo(null);
        } else if (
          scrollTo === "bottom" &&
          scrollTop === scrollHeight - clientHeight
        ) {
          setScrollTo(null);
        }
      };

      element.addEventListener("scroll", handleScroll);

      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }
  }, [ref, topThreshold, bottomThreshold, scrollTo]);

  const scrollToTop = () => {
    if (ref.current) {
      ref.current.scrollTo({ top: 0, behavior: "smooth" });
      setScrollTo("top");
    }
  };

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
      setScrollTo("bottom");
    }
  };

  return { scrollToTop, scrollToBottom, isAtTop, isAtBottom };
}

export default useScrollFunctions;
