function Header({
  title,
  description,
  rightButton,
}: {
  title: string;
  description: string;
  rightButton: React.ReactNode;
}) {
  return (
    <div className="mt-2 mb-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        {rightButton && <div>{rightButton}</div>}
      </div>
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

const Page = {
  Header,
  Body,
};

export default Page;
