import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { UploadZone } from '../components/UploadZone';
import { Features } from '../components/Features';
import { Examples } from '../components/Examples';
import { Terminal, CodeLine } from '../components/Terminal';
import { getConfig } from '../types/config';
import { useTheme } from '../hooks/useTheme';

export function App() {
  useTheme();
  const config = getConfig();
  const webAddress = config.webAddress || 'https://transfer.sh/';
  const token = config.sampleToken || 'abc123';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Easy file sharing from the command line
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Upload files with a simple cURL command and share them instantly with a unique URL.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Terminal Demo */}
              <div>
                <Terminal title="terminal">
                  <CodeLine comment="Upload using cURL" />
                  <CodeLine command={`curl --upload-file ./hello.txt ${webAddress}hello.txt`} />
                  <CodeLine output={`${webAddress}${token}/hello.txt`} />
                  <div className="mt-4" />
                  <CodeLine comment="Using the shell function" />
                  <CodeLine command="transfer hello.txt" />
                  <CodeLine output="##################################################### 100.0%" />
                  <CodeLine output={`${webAddress}${token}/hello.txt`} />
                </Terminal>
              </div>

              {/* Upload Zone */}
              <div>
                <h2 className="text-lg font-medium mb-4">Or upload from the web</h2>
                <UploadZone />
              </div>
            </div>
          </div>
        </section>

        <Features />
        <Examples />
      </main>

      <Footer />
    </div>
  );
}
