import { useState, useEffect, useRef, useCallback } from "react";

import _ from "lodash";
type ScrollTo = "top" | "bottom";

interface UseScrollFunctions {
  scrollToTop: () => void;
  scrollToBottom: () => void;
  isAtTop: boolean;
  isAtBottom: boolean;
  scrollDirection: "up" | "down" | "none";
}

function useScrollFunctions(
  ref: React.RefObject<HTMLElement>,
  topThreshold = 150,
  bottomThreshold = 150
): UseScrollFunctions {
  const [scrollTo, setScrollTo] = useState<ScrollTo | null>(null);
  const [isAtTop, setIsAtTop] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<
    "up" | "down" | "none"
  >("none");
  const rafRef = useRef<{ y: number }>({ y: 0 });

  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      const handleScroll = () => {
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;

        // 检查滚动方向
        const previousScrollTop = rafRef.current ? rafRef.current.y : 0;
        const currentScrollTop = scrollTop;
        const direction =
          currentScrollTop > previousScrollTop
            ? "down"
            : currentScrollTop < previousScrollTop
            ? "up"
            : "none";
        setScrollDirection(direction);

        rafRef.current = { y: currentScrollTop };

        // 使用 requestAnimationFrame 来优化性能
        if (scrollTo === "bottom" && direction === "up") {
          setScrollTo(null);
        }

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
      };

      element.addEventListener("scroll", handleScroll);

      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }
  }, [ref, topThreshold, bottomThreshold, scrollTo]);

  const scrollToTop = () => {
    ref.current?.scrollTo({ top: 0 });
  };

  const scrollToBottom = useCallback(
    _.debounce(() => {
      ref.current?.scrollTo({
        top: ref.current?.scrollHeight,
      });
    }, 20),
    [ref]
  );

  return { scrollToTop, scrollToBottom, isAtTop, isAtBottom, scrollDirection };
}

export default useScrollFunctions;
