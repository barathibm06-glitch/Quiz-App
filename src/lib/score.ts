export function getScoreStyles(percentage: number) {
  if (percentage >= 80) {
    return {
      text: "text-success",
      bg: "bg-success/10",
      border: "border-success/30",
      bar: "bg-success",
      stroke: "stroke-success",
    };
  }
  if (percentage >= 60) {
    return {
      text: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
      bar: "bg-warning",
      stroke: "stroke-warning",
    };
  }
  return {
    text: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    bar: "bg-danger",
    stroke: "stroke-danger",
  };
}