import React from 'react';
import { ExternalLink } from 'lucide-react';
import { detectURLs } from '@/utils/URLDetector.jsx';

const JSONRenderer = ({ payload }) => {
  if (!payload) return null;

  // Convert payload to formatted JSON string if it's an object
  const jsonString = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
  
  // Detect URLs using our utility
  const urlMatches = detectURLs(jsonString);
  
  // If no URLs found, render as standard text
  if (urlMatches.length === 0) {
    return (
      <pre className="text-xs font-mono bg-muted/50 p-4 rounded-lg overflow-x-auto border">
        <code className="text-foreground">{jsonString}</code>
      </pre>
    );
  }

  // Build the elements array using the detected URL positions
  const elements = [];
  let lastIndex = 0;

  urlMatches.forEach((match, index) => {
    // Add text before the URL
    if (match.start > lastIndex) {
      elements.push(jsonString.slice(lastIndex, match.start));
    }
    
    // Add the clickable URL
    elements.push(
      <a
        key={`url-${index}`}
        href={match.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline decoration-primary/50 underline-offset-2 cursor-pointer opacity-90 hover:opacity-100 hover:decoration-primary transition-all group inline-flex items-baseline"
      >
        {match.url}
        <ExternalLink 
          className="w-3.5 h-3.5 ml-1 opacity-70 group-hover:opacity-100 transition-opacity select-none self-center" 
          aria-hidden="true" 
        />
      </a>
    );
    
    lastIndex = match.end;
  });

  // Add any remaining text after the last URL
  if (lastIndex < jsonString.length) {
    elements.push(jsonString.slice(lastIndex));
  }

  return (
    <pre className="text-xs font-mono bg-muted/50 p-4 rounded-lg overflow-x-auto border">
      <code className="text-foreground">
        {elements.map((el, i) => (
          <React.Fragment key={i}>{el}</React.Fragment>
        ))}
      </code>
    </pre>
  );
};

export default JSONRenderer;