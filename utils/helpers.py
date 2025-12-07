def extract_text_from_file(file_path):
    """Read text file content safely"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return ""
