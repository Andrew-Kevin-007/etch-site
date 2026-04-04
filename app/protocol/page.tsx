import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"

export default function ProtocolPage() {
  return (
    <>
      <main className="relative min-h-screen overflow-hidden scanlines">
        <CursorGlow />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-36 pb-24">
            <article className="prose prose-invert max-w-none prose-pre:bg-card/50 prose-pre:border prose-pre:border-border font-mono text-sm leading-relaxed">
              <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">PROTOCOL</h1>
              <p className="text-muted-foreground text-sm uppercase tracking-widest mb-12">Technical Specification v1</p>

              <section className="mb-12 border-l-2 border-primary/30 pl-6">
                <h2 className="text-xl font-bold text-foreground mb-4">1. Overview</h2>
                <p className="text-muted-foreground">
                  The etch protocol allows developers to cryptographically sign their source code
                  files, preserving an unbroken chain of human authorship. It ensures that 
                  the provenance of code goes beyond version control and is embedded into 
                  the cryptographic registry.
                </p>
              </section>

              <section className="mb-12 border-l-2 border-primary/30 pl-6">
                <h2 className="text-xl font-bold text-foreground mb-4">2. Fingerprint Format</h2>
                <p className="text-muted-foreground mb-4">
                  Every file signed using the etch protocol is fingerprinted using a SHA-256 hash.
                  The hash ensures that any minute alteration in the code invalidates the signature, 
                  maintaining strict source integrity.
                </p>
                <div className="bg-card/50 border border-border rounded p-4 text-xs font-mono text-primary/80">
                  FILE_HASH = SHA256(FILE_CONTENT)
                </div>
              </section>

              <section className="mb-12 border-l-2 border-primary/30 pl-6">
                <h2 className="text-xl font-bold text-foreground mb-4">3. Chain Structure</h2>
                <p className="text-muted-foreground mb-4">
                  The protocol links signatures in a linear chain per author. Each subsequent signature 
                  incorporates the hash of the prior signature. This chain depth acts as a proof of time 
                  and continuous engagement, establishing robust reputation.
                </p>
                <div className="bg-card/50 border border-border rounded p-4 text-xs font-mono text-primary/80">
                  CHAIN_ID = HASH(LAST_CHAIN_ID || NEW_FILE_HASH)
                </div>
              </section>

              <section className="mb-12 border-l-2 border-primary/30 pl-6">
                <h2 className="text-xl font-bold text-foreground mb-4">4. Signing Algorithm</h2>
                <p className="text-muted-foreground mb-4">
                  Etch utilizes the Ed25519 digital signature scheme. Authors maintain control of their 
                  private keys, while the public key serves as their global identity within the registry.
                </p>
                <div className="bg-card/50 border border-border rounded p-4 text-xs font-mono text-primary/80">
                  SIGNATURE = ED25519_SIGN(PRIVATE_KEY, CHAIN_ID)
                </div>
              </section>

              <section className="mb-12 border-l-2 border-primary/30 pl-6">
                <h2 className="text-xl font-bold text-foreground mb-4">5. Threat Model</h2>
                <p className="text-muted-foreground">
                  The protocol is designed to mitigate source code impersonation and stealth modifications.
                  If a malicious actor alters a file without signing it, the hash mismatch fails verification.
                  If they attempt to sign it, they cannot mimic the original author's Ed25519 private key,
                  and the chain will clearly fork or start anew under a different identity.
                </p>
              </section>

            </article>
          </div>
          <Footer />
        </div>
      </main>
    </>
  )
}
