import spacy
from spacy.matcher import Matcher
from spacy.tokens import Span

# Load the English language model
nlp = spacy.load("en_core_web_sm")

# Define patterns for important clauses
important_patterns = [
    [{"LOWER": "important"}, {"LOWER": "notice"}],
    [{"LOWER": "please"}, {"LOWER": "read"}, {"LOWER": "carefully"}],
    [{"LOWER": "you"}, {"LOWER": "agree"}, {"LOWER": "to"}],
]

leverageable_patterns = [
    [{"LOWER": "may"}, {"POS": "VERB"}],
    [{"LOWER": "option"}, {"LOWER": "to"}],
    [{"LOWER": "right"}, {"LOWER": "to"}],
]

dangerous_patterns = [
    [{"LOWER": "waive"}, {"POS": "NOUN"}],
    [{"LOWER": "not"}, {"LOWER": "liable"}],
    [{"LOWER": "no"}, {"LOWER": "refund"}],
]

def classify_clause(clause):
    doc = nlp(clause)
    
    # Create matchers for each category
    important_matcher = Matcher(nlp.vocab)
    leverageable_matcher = Matcher(nlp.vocab)
    dangerous_matcher = Matcher(nlp.vocab)
    
    # Add patterns to matchers
    important_matcher.add("Important", important_patterns)
    leverageable_matcher.add("Leverageable", leverageable_patterns)
    dangerous_matcher.add("Dangerous", dangerous_patterns)
    
    # Apply matchers
    important_matches = important_matcher(doc)
    leverageable_matches = leverageable_matcher(doc)
    dangerous_matches = dangerous_matcher(doc)
    
    # Classify based on matches
    if important_matches:
        return "Important Information"
    elif leverageable_matches:
        return "Leverageable Clause"
    elif dangerous_matches:
        return "Dangerous Clause"
    else:
        return "Standard Clause"

def analyze_legal_text(text):
    doc = nlp(text)
    results = []
    
    # Split text into sentences and classify each
    for sent in doc.sents:
        classification = classify_clause(sent.text)
        results.append({
            "text": sent.text,
            "classification": classification
        })
    
    return results

# Example usage
terms_and_conditions = """
Please read the following terms and conditions carefully. 
By using our service, you agree to be bound by these terms. 
We may update these terms at our discretion. 
You waive your right to a jury trial in any dispute. 
We are not liable for any damages arising from the use of our service. 
You have the option to cancel your subscription at any time.
"""

analysis_results = analyze_legal_text(terms_and_conditions)

for result in analysis_results:
    print(f"Classification: {result['classification']}")
    print(f"Text: {result['text']}")
    print()
