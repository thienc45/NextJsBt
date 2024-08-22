export default function LoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <div >LoginLayout
                {children}
            </div>
        </html>
    );
}