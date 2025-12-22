import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Terminal, CodeLine, CopyableCode } from './Terminal';
import { getConfig } from '../types/config';

export function Examples() {
  const [showMore, setShowMore] = useState(false);
  const config = getConfig();
  const webAddress = config.webAddress || 'https://transfer.sh/';
  const token = config.sampleToken || 'abc123';
  const token2 = config.sampleToken2 || 'def456';

  const shellFunction = String.raw`transfer(){ if [ $# -eq 0 ];then echo "No arguments specified.\nUsage:\n  transfer <file|directory>\n  ... | transfer <file_name>">&2;return 1;fi;if tty -s;then file="$1";file_name=$(basename "$file");if [ ! -e "$file" ];then echo "$file: No such file or directory">&2;return 1;fi;if [ -d "$file" ];then file_name="$file_name.zip";(cd "$file"&&zip -r -q - .)|curl --progress-bar --upload-file "-" "${webAddress}$file_name"|tee /dev/null;else cat "$file"|curl --progress-bar --upload-file "-" "${webAddress}$file_name"|tee /dev/null;fi;else file_name=$1;curl --progress-bar --upload-file "-" "${webAddress}$file_name"|tee /dev/null;fi;}`;

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-center mb-12">Usage Examples</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-medium mb-3">Upload with cURL</h3>
            <Terminal>
              <CodeLine comment="Upload a file" />
              <CodeLine command={`curl --upload-file ./hello.txt ${webAddress}hello.txt`} />
              <CodeLine output={`${webAddress}${token}/hello.txt`} />
              <div className="mt-4" />
              <CodeLine comment="With max downloads and expiry" />
              <CodeLine command={`curl -H "Max-Downloads: 1" -H "Max-Days: 5" --upload-file ./hello.txt ${webAddress}hello.txt`} />
              <CodeLine output={`${webAddress}${token}/hello.txt`} />
            </Terminal>
          </div>

          <div>
            <h3 className="font-medium mb-3">Shell Function</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Add this to your <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.bashrc</code> or <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.zshrc</code>:
            </p>
            <CopyableCode code={shellFunction} />
            <Terminal title="Usage">
              <CodeLine command="transfer hello.txt" />
              <CodeLine output="##################################################### 100.0%" />
              <CodeLine output={`${webAddress}${token2}/hello.txt`} />
            </Terminal>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowMore(!showMore)}
            className="btn btn-secondary"
          >
            {showMore ? 'Show less' : 'More examples'}
            {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showMore && (
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="font-medium mb-3">Multiple Files</h3>
              <Terminal>
                <CodeLine command={`curl -i -F filedata=@/tmp/hello.txt -F filedata=@/tmp/hello2.txt ${webAddress}`} />
                <div className="mt-4" />
                <CodeLine comment="Download as archive" />
                <CodeLine command={`curl ${webAddress}(${token}/hello.txt,${token2}/world.txt).zip`} />
              </Terminal>
            </div>

            <div>
              <h3 className="font-medium mb-3">Encrypt with GPG</h3>
              <Terminal>
                <CodeLine comment="Encrypt and upload" />
                <CodeLine command={`cat /tmp/hello.txt | gpg -ac -o- | curl -X PUT --upload-file "-" ${webAddress}test.txt`} />
                <div className="mt-4" />
                <CodeLine comment="Download and decrypt" />
                <CodeLine command={`curl ${webAddress}${token}/test.txt | gpg -o- > /tmp/hello.txt`} />
              </Terminal>
            </div>

            <div>
              <h3 className="font-medium mb-3">Encrypt with OpenSSL</h3>
              <Terminal>
                <CodeLine comment="Encrypt and upload" />
                <CodeLine command={`cat /tmp/hello.txt | openssl aes-256-cbc -pbkdf2 -e | curl -X PUT --upload-file "-" ${webAddress}test.txt`} />
                <div className="mt-4" />
                <CodeLine comment="Download and decrypt" />
                <CodeLine command={`curl ${webAddress}${token}/test.txt | openssl aes-256-cbc -pbkdf2 -d > /tmp/hello.txt`} />
              </Terminal>
            </div>

            <div>
              <h3 className="font-medium mb-3">PowerShell (Windows)</h3>
              <Terminal>
                <CodeLine command={`Invoke-WebRequest -Method PUT -InFile .\\file.txt ${webAddress}file.txt`} />
              </Terminal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
