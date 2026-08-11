export function PepSphere({ processing = false }: { processing?: boolean }) {
  return <div className={`pep-sphere ${processing ? "is-processing" : ""}`} aria-hidden="true"><span className="pep-sphere-core" /><span className="pep-sphere-ring pep-sphere-ring-one" /><span className="pep-sphere-ring pep-sphere-ring-two" /><span className="pep-sphere-orbit pep-sphere-orbit-one" /><span className="pep-sphere-orbit pep-sphere-orbit-two" /></div>;
}
