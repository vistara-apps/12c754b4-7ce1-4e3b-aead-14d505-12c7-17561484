"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  textClassName?: string;
}

export function ExpandableText({
  text,
  maxLength = 150,
  className = "",
  textClassName = ""
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If text is shorter than maxLength, no need for expansion
  if (text.length <= maxLength) {
    return (
      <p className={`${textClassName}`}>
        {text}
      </p>
    );
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded 
    ? text 
    : `${text.substring(0, maxLength)}...`;

  return (
    <div className={`${className}`}>
      <p className={`${textClassName} whitespace-pre-wrap`}>
        {displayText}
      </p>
      <button
        onClick={toggleExpand}
        className="flex items-center gap-xs text-xs text-accent hover:text-accent/80 mt-xs transition-colors"
        aria-expanded={isExpanded}
        aria-controls="expandable-content"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-3 h-3" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="w-3 h-3" />
            Show More
          </>
        )}
      </button>
    </div>
  );
}

