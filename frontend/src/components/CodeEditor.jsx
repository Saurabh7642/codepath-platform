import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

const CodeEditor = ({ language, value, onChange }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: value || '',
        language: language || 'cpp',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      });

      editorRef.current.onDidChangeModelContent(() => {
        const currentValue = editorRef.current.getValue();
        onChange(currentValue);
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, [containerRef]);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return <div ref={containerRef} style={{ height: '400px', width: '100%' }} />;
};

export default CodeEditor;
