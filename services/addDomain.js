import path from "path";
import util from "util";
import { exec as execCallback } from "child_process";
import dns from "dns/promises";

const exec = util.promisify(execCallback);

const sitesEnabledPath = "/etc/nginx/sites-enabled";
const sitesAvailabelPath = "/etc/nginx/sites-available";

export async function Adddomain(domainName) {
  try {
    await checkIfRootUser();
    await ensureDirectoryExists(sitesEnabledPath);
    await ensureDirectoryExists(sitesAvailabelPath);
    await createNginxConfig(domainName);
    await reloadNginx();
    await createSSLCertificate(domainName);
  } catch (error) {
    console.log("Error in creating domain:", domainName, error.message);
  }
}

async function checkIfRootUser() {
  if (process.getuid() !== 0) {
    throw new Error("This script must be run as root");
  }
}

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    throw new Error(`Directory does not exist: ${dirPath}`);
  }
}

async function createNginxConfig(domainName) {
  const configContent = `
    server {
        listen 80;
        server_name ${domainName};
    
        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }`;

  const sitesAvailabeldomainPath = path.join(sitesAvailabelPath, domainName);
  const sitesEnabledDomainPath = path.join(sitesEnabledPath, domainName);

  try {
    await fs.writeFile(sitesAvailabeldomainPath, configContent);
    await createSymbolicLink(sitesAvailabeldomainPath, sitesEnabledDomainPath);
    console.log("Nginx config file created successfully at:", filePath);
  } catch (err) {
    console.error("Error writing Nginx config file:", err.message);
    throw new Error(err.message);
  }
}

async function reloadNginx() {
  try {
    const { stdout, stderr } = await exec("sudo systemctl reload nginx");
    console.log("Nginx reloaded successfully:", stdout);
    if (stderr) {
      console.log("stderr:", stderr);
    }
  } catch (error) {
    console.error("Error reloading Nginx:", error.message);
    throw new Error(error.message);
  }
}

async function createSSLCertificate(domainName) {
  try {
    const { stdout, stderr } = await exec(
      `sudo certbot --nginx -d ${domainName}`
    );
    if (stdout) {
    }
    console.log("SSL certificate creation stdout:", stdout);
    if (stderr) {
      console.log("stderr: error while creating SSL certificate", stderr);
    }
  } catch (error) {
    console.error("Error while creating SSL certificate:", error.message);
    throw new Error(error.message);
  }
}

async function createSymbolicLink(target, destination) {
  try {
    await fs.symlink(target, destination);
    console.log("Symbolic link created from", target, "to", destination);
  } catch (err) {
    if (err.code === "EEXIST") {
      console.log("Symbolic link already exists:", destination);
    } else {
      console.error("Error creating symbolic link:", err.message);
      throw new Error(err.message);
    }
  }
}

export async function verifyDomainMapping(domain, expectedIp = "34.125.77.53") {
  try {
    // Perform DNS lookup
    const addresses = await dns.lookup(domain, { all: true });
    const ipAddresses = addresses.map((addr) => addr.address);

    console.log(`Domain ${domain} resolves to IPs: ${ipAddresses.join(", ")}`);

    // Check if the expected IP is in the list of resolved IPs
    if (ipAddresses.includes(expectedIp)) {
      console.log(`Domain ${domain} is correctly mapped to ${expectedIp}`);
      return true;
    } else {
      console.log(
        `Domain ${domain} is NOT mapped to ${expectedIp}. Actual IPs: ${ipAddresses.join(
          ", "
        )}`
      );
      return false;
    }
  } catch (err) {
    console.error(`Error looking up domain: ${err.message}`);
    return false;
  }
}
