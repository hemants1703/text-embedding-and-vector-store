"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { UMAP } from "umap-js";

interface VectorPlot3DProps {
  embedding: number[];
  className?: string;
  allEmbeddings?: number[][]; // Optional: all embeddings for better PCA
  highlightIndex?: number; // Optional: which embedding to highlight
}

export default function VectorPlot3D({
  embedding,
  className = "",
  allEmbeddings,
  highlightIndex = 0,
}: VectorPlot3DProps) {
  const pointsData = useMemo(() => {
    if (!embedding || embedding.length === 0) {
      return { points: new Float32Array(0), colors: new Float32Array(0) };
    }

    // Prepare data matrix
    let dataMatrix: number[][] = [];
    if (allEmbeddings && allEmbeddings.length > 1) {
      dataMatrix = allEmbeddings;
    } else {
      // Fallback: windowing or noise as before
      const windowSize = 50;
      const numWindows = Math.floor(embedding.length / windowSize);
      for (let i = 0; i < numWindows; i++) {
        dataMatrix.push(embedding.slice(i * windowSize, (i + 1) * windowSize));
      }
      while (dataMatrix.length < 10) {
        const noisy = embedding.map(
          (val) => val + (Math.random() - 0.5) * 0.001
        );
        dataMatrix.push(noisy.slice(0, windowSize));
      }
    }

    // UMAP dimensionality reduction
    try {
      const umap = new UMAP({ nComponents: 3, nNeighbors: 15, minDist: 0.1 });
      const reduced = umap.fit(dataMatrix);

      const numPoints = reduced.length;
      const pointsArray = new Float32Array(numPoints * 3);
      const colorsArray = new Float32Array(numPoints * 3);

      const SCALE = 20;
      for (let i = 0; i < numPoints; i++) {
        pointsArray[i * 3] = reduced[i][0] * SCALE;
        pointsArray[i * 3 + 1] = reduced[i][1] * SCALE;
        pointsArray[i * 3 + 2] = reduced[i][2] * SCALE;

        // Highlight logic as before
        if (allEmbeddings && allEmbeddings.length > 1) {
          if (i === highlightIndex) {
            colorsArray[i * 3] = 0.0;
            colorsArray[i * 3 + 1] = 1.0;
            colorsArray[i * 3 + 2] = 0.5;
          } else {
            colorsArray[i * 3] = 0.3;
            colorsArray[i * 3 + 1] = 0.7;
            colorsArray[i * 3 + 2] = 1.0;
          }
        } else {
          const intensity = 0.5 + 0.5 * Math.sin(i * 0.1);
          colorsArray[i * 3] = 0.0;
          colorsArray[i * 3 + 1] = intensity;
          colorsArray[i * 3 + 2] = 0.5;
        }
      }
      return { points: pointsArray, colors: colorsArray };
    } catch (error) {
      console.error("UMAP error:", error);
      // Fallback: Create a simple spiral pattern based on embedding values
      const numPoints = Math.min(200, embedding.length);
      const pointsArray = new Float32Array(numPoints * 3);
      const SCALE = 50;
      for (let i = 0; i < numPoints; i++) {
        const embeddingValue = embedding[i % embedding.length];
        const angle = (i / numPoints) * Math.PI * 4;
        const radius = Math.abs(embeddingValue) * SCALE + 5;
        pointsArray[i * 3] = Math.cos(angle) * radius;
        pointsArray[i * 3 + 1] = (i / numPoints) * 40 - 20;
        pointsArray[i * 3 + 2] = Math.sin(angle) * radius;
      }
      return {
        points: pointsArray,
        colors: new Float32Array(numPoints * 3).fill(0.5),
      };
    }
  }, [embedding, allEmbeddings, highlightIndex]);

  // Extract points and colors from the data
  const points = "points" in pointsData ? pointsData.points : pointsData;
  const colors = "colors" in pointsData ? pointsData.colors : null;

  const stats = useMemo(() => {
    if (!embedding || embedding.length === 0) return null;

    const min = Math.min(...embedding);
    const max = Math.max(...embedding);
    const avg = embedding.reduce((sum, val) => sum + val, 0) / embedding.length;

    return {
      min,
      max,
      avg,
      length: embedding.length,
      method: "UMAP Dimensionality Reduction",
    };
  }, [embedding]);

  if (!embedding || embedding.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No embedding data available
        </p>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Unable to generate visualization points
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {stats && (
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
          <div className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
            {stats.method} ({stats.length}D → 3D)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Original Vector Length: {stats.length}</div>
            <div>3D Points Generated: {Math.floor(points.length / 3)}</div>
            <div>Min Value: {stats.min.toFixed(6)}</div>
            <div>Max Value: {stats.max.toFixed(6)}</div>
            <div>Average: {stats.avg.toFixed(6)}</div>
            <div>Range: {(stats.max - stats.min).toFixed(6)}</div>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
            💡 Drag to rotate • Scroll to zoom • Right-click to pan •{" "}
            {Math.floor(points.length / 3)} points visible
          </div>
        </div>
      )}
      <div className="w-full h-[400px]">
        <Canvas camera={{ position: [30, 30, 30], fov: 75 }}>
          <color attach="background" args={["#0a0a0a"]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[50, 50, 50]} intensity={1.5} />
          <pointLight position={[-50, -50, -50]} intensity={0.7} />
          <pointLight position={[0, 50, 0]} intensity={0.5} />
          <Points>
            <PointMaterial
              transparent
              vertexColors={colors ? true : false}
              color={colors ? "#ffffff" : "#00ff88"}
              size={3.0}
              sizeAttenuation={true}
            />
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[points, 3]}
              />
              {colors && (
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
              )}
            </bufferGeometry>
          </Points>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={1.2}
            panSpeed={0.8}
            rotateSpeed={0.8}
            minDistance={10}
            maxDistance={200}
          />
          <gridHelper args={[100, 20, "#333333", "#1a1a1a"]} />
          <axesHelper args={[25]} />
        </Canvas>
      </div>
    </div>
  );
}
