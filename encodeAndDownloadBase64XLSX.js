const handleDownloadReport = async (aliasId, docStoreId) => {
    setIsLoading(true);
    try {
      const response = await downloadMetricReport(aliasId, docStoreId);
      const contentDisposition = response.headers["content-disposition"];
      const contentType = response.headers["x-original-content-type"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.trim()?.replace(/"/g, "") ||
          "downloaded_file"
        : "downloaded_file";
      const byteCharacters = atob(response.data);
      const byteArray = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      const uint8Array = new Uint8Array(byteArray);
      const blob = new Blob([uint8Array], { type: contentType });

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // For IE11 and Edge (legacy)
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
      }

      message.success(`${filename} downloaded successfully.`);
    } catch (error) {
      message.error(
        `CLIENT_EXCEPTION::Could not parse file with error: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };
