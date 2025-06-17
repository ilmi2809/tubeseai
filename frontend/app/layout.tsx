
import './globals.css'
import { ApolloWrapper } from './ApolloWrapper'
import { CartProvider } from './CartContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <CartProvider>
            {children}
          </CartProvider>
        </ApolloWrapper>
      </body>
    </html>
  )
}
