function SectionHeading({ label, title, description }) {
  return (
    <div className="section-heading">
      <p className="section-label">{label}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default SectionHeading;
